"use client"

import { SelectExtensionGroups, SelectFolderData } from "@/constant/selectFoloderData"
import { usePageContext } from "@/context/PageContext"
import type React from "react"

import { useState } from "react"


export function useFolderSelect() {
  const [searchTerm, setSearchTerm] = useState("")
  const {page} = usePageContext()
  const isExtensionPage = page === 'extensions'

  const [selected, setSelected] = useState<string>(isExtensionPage ? 'Extension Groups' : 'Bookmarks')
  const [openPopover, setOpenPopover] = useState(false)
const data = isExtensionPage ? SelectExtensionGroups : SelectFolderData
  const filteredFolders = data.filter((folder) => folder.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSelect = (folder: string) => {
    setSelected(folder)
    setOpenPopover(false)
  }

  return {
    searchTerm,
    selected,
    openPopover,
    filteredFolders,
    handleSearch,
    handleSelect,
    setOpenPopover,
  }
}

