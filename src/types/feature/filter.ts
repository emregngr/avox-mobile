export type FilterOptionType = {
  label: string
  value: string | number
}

export type RangeFilterOptionType = {
  label: string
  value: string | number
}

export type FilterModalPropsType = {
  currentFilters: Record<string, any>
  onApply: (filters: Record<string, any>) => void
  onClose: () => void
  type: 'airports' | 'airlines'
}
