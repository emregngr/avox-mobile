export type FilterOption = {
  label: string
  value: string | number
}

export type RangeFilterOption = {
  label: string
  value: string | number
}

export type FilterModalProps = {
  currentFilters: Record<string, any>,
  onApply: (filters: Record<string, any>) => void
  onClose: () => void,
  type: 'airports' | 'airlines'
}
