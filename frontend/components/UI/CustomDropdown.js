import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

export default function CustomDropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option",
  icon: Icon,
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          border-2 border-gray-200 rounded-xl bg-white
          hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500
          transition-all duration-200 shadow-sm hover:shadow-md
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-500' : ''}
        `}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          )}
          <span className={`font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left
                hover:bg-primary-50 transition-colors duration-150
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                ${option.value === value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
              `}
            >
              <span className="font-medium">{option.label}</span>
              {option.value === value && (
                <CheckIcon className="h-5 w-5 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Enhanced dropdown with search functionality
export function SearchableDropdown({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Search and select...",
  icon: Icon,
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          border-2 border-gray-200 rounded-xl bg-white
          hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500
          transition-all duration-200 shadow-sm hover:shadow-md
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-500' : ''}
        `}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          )}
          <span className={`font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Options */}
          <div className="max-h-48 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 text-left
                    hover:bg-primary-50 transition-colors duration-150
                    ${index === filteredOptions.length - 1 ? 'rounded-b-xl' : ''}
                    ${option.value === value ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
                  `}
                >
                  <span className="font-medium">{option.label}</span>
                  {option.value === value && (
                    <CheckIcon className="h-5 w-5 text-primary-600" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi-select dropdown
export function MultiSelectDropdown({ 
  options = [], 
  values = [], 
  onChange, 
  placeholder = "Select options...",
  icon: Icon,
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const selectedOptions = options.filter(option => values.includes(option.value))

  const handleToggleOption = (optionValue) => {
    const newValues = values.includes(optionValue)
      ? values.filter(v => v !== optionValue)
      : [...values, optionValue]
    onChange(newValues)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-left
          border-2 border-gray-200 rounded-xl bg-white
          hover:border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500
          transition-all duration-200 shadow-sm hover:shadow-md
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'border-primary-500 ring-2 ring-primary-500' : ''}
        `}
      >
        <div className="flex items-center">
          {Icon && (
            <Icon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
          )}
          <span className={`font-medium ${selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOptions.length > 0 
              ? `${selectedOptions.length} selected`
              : placeholder
            }
          </span>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleToggleOption(option.value)}
              className={`
                w-full flex items-center justify-between px-4 py-3 text-left
                hover:bg-primary-50 transition-colors duration-150
                ${index === 0 ? 'rounded-t-xl' : ''}
                ${index === options.length - 1 ? 'rounded-b-xl' : ''}
                ${values.includes(option.value) ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
              `}
            >
              <span className="font-medium">{option.label}</span>
              {values.includes(option.value) && (
                <CheckIcon className="h-5 w-5 text-primary-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
