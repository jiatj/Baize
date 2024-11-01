import {
  Fragment,
  memo,
  useCallback,
  useState,
} from 'react'
import ReactDOM from 'react-dom'
import {
  flip,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react'
import { COMMAND_PRIORITY_NORMAL, type TextNode } from 'lexical'
import type { MenuRenderFn, MenuTextMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type {
  MenuBlockType,
} from '../../types'
import { useBasicTypeaheadTriggerMatch } from '../../hooks'
import { useOptions } from './hooks'
import type { PickerBlockMenuOption } from './menu'

type ComponentPickerProps = {
  triggerString: string
  menuBlock?: MenuBlockType
}
const ComponentPicker = ({
  triggerString,
  menuBlock
}: ComponentPickerProps) => {
  const { refs, floatingStyles, isPositioned } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(0), // fix hide cursor
      shift({
        padding: 8,
      }),
      flip(),
    ],
  })
  const [editor] = useLexicalComposerContext()
  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('', {
    minLength: 0,
    maxLength: 100,
  })
  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  function getPossibleQueryMatch(text: string): MenuTextMatch | null {
    return checkForAtSignMentions(text, 0);
  }

  const PUNCTUATION =
    '\\.,\\+\\*\\?\\$\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
  const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

  const DocumentMentionsRegex = {
    NAME,
    PUNCTUATION,
  };

  const PUNC = DocumentMentionsRegex.PUNCTUATION;

  const TRIGGERS = [triggerString].join('');

  // Chars we expect to see in a mention (non-space, non-punctuation).
  const VALID_CHARS = '[^' + PUNC + '\\s]';

  // Non-standard series of chars. Each series must be preceded and followed by
  // a valid char.
  const VALID_JOINS =
    '(?:' +
    '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
    ' |' + // E.g. " " in "Josh Duck"
    '[' +
    PUNC +
    ']|' + // E.g. "-' in "Salier-Hellendag"
    ')';

  const LENGTH_LIMIT = 75;

  const AtSignMentionsRegex = new RegExp(
    '(^[A-Za-z0-9]|\)(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
  );
  // 50 is the longest alias length limit.
  const ALIAS_LENGTH_LIMIT = 50;
  // Regex used to match alias.
  const AtSignMentionsRegexAliasRegex = new RegExp(
    '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
  );
  function checkForAtSignMentions(
    text: string,
    minMatchLength: number,
  ): MenuTextMatch | null {
    let match = AtSignMentionsRegex.exec(text);
    if (match === null) {
      match = AtSignMentionsRegexAliasRegex.exec(text);
    }
    if (match !== null) {
      // The strategy ignores leading whitespace but we need to know it's
      // length to add it to the leadOffset
      const maybeLeadingWhitespace = match[1];

      const matchingString = match[3];
      if (matchingString.length >= minMatchLength) {
        return {
          leadOffset: match.index + maybeLeadingWhitespace.length,
          matchingString,
          replaceableString: match[2],
        };
      }
    }
    return null;
  }

  const [queryString, setQueryString] = useState<string | null>(null)

  const {
    allFlattenOptions
  } = useOptions(
    menuBlock,
    queryString,
  )


  const onSelectOption = useCallback(
    (
      selectedOption: PickerBlockMenuOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        if (nodeToRemove && selectedOption?.key)
          nodeToRemove.remove()

        selectedOption.onSelectMenuOption()
        closeMenu()
      })
    },
    [editor],
  )

  const renderMenu = useCallback<MenuRenderFn<PickerBlockMenuOption>>((
    anchorElementRef,
    { options, selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
  ) => {
    if (!(anchorElementRef.current && (allFlattenOptions?.length)))
      return null
    refs.setReference(anchorElementRef.current)

    return (
      <>
        {
          ReactDOM.createPortal(
            // The `LexicalMenu` will try to calculate the position of the floating menu based on the first child.
            // Since we use floating ui, we need to wrap it with a div to prevent the position calculation being affected.
            // See https://github.com/facebook/lexical/blob/ac97dfa9e14a73ea2d6934ff566282d7f758e8bb/packages/lexical-react/src/shared/LexicalMenu.ts#L493
            <div className='w-0 h-0'>
              <div
                className='p-1 w-[260px] bg-white rounded-lg border-[0.5px] border-gray-200 shadow-lg overflow-y-auto overflow-x-hidden'
                style={{
                  ...floatingStyles,
                  visibility: isPositioned ? 'visible' : 'hidden',
                  maxHeight: 'calc(1 / 3 * 100vh)',
                }}
                ref={refs.setFloating}
              >
                {
                  options.map((option, index) => (
                    <Fragment key={option.key}>
                      {option.renderMenuOption({
                        queryString,
                        isSelected: selectedIndex === index,
                        onSelect: () => {
                          selectOptionAndCleanUp(option)
                        },
                        onSetHighlight: () => {
                          setHighlightedIndex(index)
                        },
                      })}
                    </Fragment>
                  ))
                }
              </div>
            </div>,
            anchorElementRef.current,
          )
        }
      </>
    )
  }, [allFlattenOptions?.length, refs, isPositioned, floatingStyles, queryString])

  return (
    <LexicalTypeaheadMenuPlugin
      options={allFlattenOptions}
      commandPriority={COMMAND_PRIORITY_NORMAL}
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      // The `translate` class is used to workaround the issue that the `typeahead-menu` menu is not positioned as expected.
      // See also https://github.com/facebook/lexical/blob/772520509308e8ba7e4a82b6cd1996a78b3298d0/packages/lexical-react/src/shared/LexicalMenu.ts#L498
      //
      // We no need the position function of the `LexicalTypeaheadMenuPlugin`,
      // so the reference anchor should be positioned based on the range of the trigger string, and the menu will be positioned by the floating ui.
      anchorClassName='z-[999999] translate-y-[calc(-100%-3px)]'
      menuRenderFn={renderMenu}
      triggerFn={checkForMentionMatch}
    />
  )
}

export default memo(ComponentPicker)
