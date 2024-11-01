import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import type {
  MenuBlockType, MenuOption,
} from '../../types'
import { MenuItem } from './menu-option'
import { PickerBlockMenuOption } from './menu'
import AppIcon from '@/app/components/base/app-icon'

export const useMenuOptions = (
  menuBlock?: MenuBlockType,
  queryString?: string | null,
): PickerBlockMenuOption[] => {
  const { t } = useTranslation()
  const [editor] = useLexicalComposerContext()

  const options = useMemo(() => {
    if (!menuBlock?.menu)
      return []
    let menu = menuBlock.menu
    if (queryString) {
      menu = menu.filter((item: MenuOption) => {
        return item.name.toLowerCase().includes(queryString.toLowerCase())
      })
    }
    const baseOptions = (menu).map((item: MenuOption) => {

      return new PickerBlockMenuOption({
        key: item.id,
        name: item.name,
        group: 'menu datasets',

        render: ({ queryString, isSelected, onSelect, onSetHighlight }) => {
          return (
            <MenuItem
              title={item.name}
              icon={
                <AppIcon
                  className='!w-[14px] !h-[14px]'
                  icon={item.icon}
                  background={item.icon_background}
                />
              }
              extraElement={<div className='text-xs text-gray-400'>ccc</div>}
              queryString={queryString}
              isSelected={isSelected}
              onClick={onSelect}
              onMouseEnter={onSetHighlight}
            />
          )
        },
        onSelect: () => {
          menuBlock?.onSelect?.(item)
        },
      })
    })
    return baseOptions
  }, [editor, queryString, menuBlock])
  return useMemo(() => {
    return menuBlock?.show ? options : []
  }, [options, menuBlock?.show])
}

export const useOptions = (
  menuBlock?: MenuBlockType,
  queryString?: string | null,
) => {
  const menuOptions = useMenuOptions(menuBlock, queryString)

  return useMemo(() => {
    return {
      allFlattenOptions: menuOptions,
    }
  }, [menuOptions])
}
