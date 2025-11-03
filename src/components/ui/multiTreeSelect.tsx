import React, { useState } from 'react'
import { ChevronRight, ChevronDown } from 'lucide-react'

interface TreeNode {
  title: string
  value: string
  key: string
  children?: TreeNode[]
}

interface TreeSelectProps {
  treeData: TreeNode[]
  value: string[]
  onChange: (value: string[]) => void
  treeCheckable?: boolean
  showCheckedStrategy?: 'SHOW_PARENT' | 'SHOW_CHILD' | 'SHOW_ALL'
  placeholder?: string
  style?: React.CSSProperties
  className?: string
}

const TreeSelect: React.FC<TreeSelectProps> = ({
  treeData,
  value,
  onChange,
  treeCheckable = true,
  showCheckedStrategy = 'SHOW_ALL',
  placeholder = 'Please select',
  style,
  className = '',
}) => {
  const [expandedNodes, setExpandedNodes] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Get all child values for a parent node
  const getChildValues = (node: TreeNode): string[] => {
    const values: string[] = []
    if (node.children) {
      node.children.forEach((child) => {
        values.push(child.value)
        if (child.children) {
          values.push(...getChildValues(child))
        }
      })
    }
    return values
  }

  // Check if all children are selected
  const areAllChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children) return false
    const childValues = getChildValues(node)
    return childValues.every((val) => value.includes(val))
  }

  // Check if some children are selected
  const areSomeChildrenSelected = (node: TreeNode): boolean => {
    if (!node.children) return false
    const childValues = getChildValues(node)
    return childValues.some((val) => value.includes(val))
  }

  // Handle checkbox change
  const handleCheckboxChange = (node: TreeNode, checked: boolean) => {
    let newSelectedValues = [...value]

    if (node.children) {
      // Parent node - select/deselect parent and all children
      const childValues = getChildValues(node)
      if (checked) {
        // Add parent value if not already selected
        if (!newSelectedValues.includes(node.value)) {
          newSelectedValues.push(node.value)
        }
        // Add all child values that aren't already selected
        childValues.forEach((val) => {
          if (!newSelectedValues.includes(val)) {
            newSelectedValues.push(val)
          }
        })
      } else {
        // Remove parent value and all child values
        newSelectedValues = newSelectedValues.filter(
          (val) => val !== node.value && !childValues.includes(val)
        )
      }
    } else {
      // Leaf node
      if (checked) {
        if (!newSelectedValues.includes(node.value)) {
          newSelectedValues.push(node.value)
        }
      } else {
        newSelectedValues = newSelectedValues.filter(
          (val) => val !== node.value
        )
      }
    }

    onChange(newSelectedValues)
  }

  // Toggle node expansion
  const toggleExpanded = (nodeKey: string) => {
    setExpandedNodes((prev) =>
      prev.includes(nodeKey)
        ? prev.filter((key) => key !== nodeKey)
        : [...prev, nodeKey]
    )
  }

  // Get display text for selected items
  const getDisplayText = (): string => {
    if (value.length === 0) return placeholder

    if (showCheckedStrategy === 'SHOW_ALL') {
      const displayItems: string[] = []

      treeData.forEach((node) => {
        if (node.children) {
          const childValues = getChildValues(node)
          const selectedChildren = childValues.filter((val) =>
            value.includes(val)
          )

          if (
            value.includes(node.value) &&
            selectedChildren.length === childValues.length
          ) {
            // Parent and all children selected, show parent only
            displayItems.push(node.title)
          } else if (selectedChildren.length > 0) {
            // Some children selected, show individual children
            node.children.forEach((child) => {
              if (value.includes(child.value)) {
                displayItems.push(child.title)
              }
            })
          }
        } else if (value.includes(node.value)) {
          displayItems.push(node.title)
        }
      })

      return displayItems.join(', ')
    } else {
      // SHOW_CHILD strategy - show all selected items
      const allNodes: TreeNode[] = []
      const collectNodes = (nodes: TreeNode[]) => {
        nodes.forEach((node) => {
          allNodes.push(node)
          if (node.children) {
            collectNodes(node.children)
          }
        })
      }
      collectNodes(treeData)

      const selectedTitles = allNodes
        .filter((node) => value.includes(node.value))
        .map((node) => node.title)

      return selectedTitles.join(', ')
    }
  }

  // Render tree node
  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes.includes(node.key)
    const hasChildren = node.children && node.children.length > 0
    const isSelected = value.includes(node.value)
    const allChildrenSelected = areAllChildrenSelected(node)
    const someChildrenSelected = areSomeChildrenSelected(node)

    const checkboxState = hasChildren
      ? isSelected && allChildrenSelected
        ? 'checked'
        : someChildrenSelected || isSelected
          ? 'indeterminate'
          : 'unchecked'
      : isSelected
        ? 'checked'
        : 'unchecked'

    return (
      <div key={node.key} className='select-none'>
        <div
          className='flex cursor-pointer items-center px-2 py-1 hover:bg-gray-50'
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              type='button'
              onClick={() => toggleExpanded(node.key)}
              className='mr-1 rounded p-0.5 hover:bg-gray-200'
            >
              {isExpanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </button>
          )}
          {!hasChildren && <div className='w-6' />}

          {treeCheckable && (
            <label className='flex flex-1 cursor-pointer items-center'>
              <input
                type='checkbox'
                checked={checkboxState === 'checked'}
                ref={(el) => {
                  if (el && checkboxState === 'indeterminate') {
                    el.indeterminate = true
                  }
                }}
                onChange={(e) => handleCheckboxChange(node, e.target.checked)}
                className='mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              />
              <span className='text-sm'>{node.title}</span>
            </label>
          )}

          {!treeCheckable && (
            <div
              className='flex-1 cursor-pointer py-1'
              onClick={() => onChange([node.value])}
            >
              <span className='text-sm'>{node.title}</span>
            </div>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} style={style}>
      <div className='relative'>
        <button
          type='button'
          onClick={() => setIsOpen(!isOpen)}
          className='w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-300 focus:outline-none'
        >
          <span className='block truncate text-sm'>{getDisplayText()}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <ChevronDown className='h-4 w-4 text-gray-400' />
          </span>
        </button>

        {isOpen && (
          <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-scroll rounded-md border border-gray-300 bg-white shadow-lg'>
            <div className='py-1'>
              {treeData.map((node) => renderTreeNode(node))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TreeSelect
