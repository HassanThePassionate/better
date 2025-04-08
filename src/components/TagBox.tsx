"use client";

import type React from "react";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  type KeyboardEvent,
} from "react";

import { TagButton } from "./AddTagBtn";
import { PlusIcon } from "./svgs/PlusIcon";
import type { Tag } from "@/types/tag";
import { useFormContext } from "@/context/from-Context";
import { useBookmarks } from "@/context/BookmarkContext";

interface TagBoxProps {
  allowedText?: boolean;
  onTagsChange?: (tags: string[]) => void;
  tag?: { id: string; name: string }[] | undefined;
}

export default function TagBox({
  allowedText = false,
  onTagsChange,
  tag,
}: TagBoxProps) {
  const [tagInputValue, setTagInputValue] = useState("");
  const { updateFormData } = useFormContext();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { categories, setCategories } = useBookmarks();

  const [searchTerm, setSearchTerm] = useState("");

  const notificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const formUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (tag && tag.length > 0) {
      const initialTags = tag.map((t) => t.name);
      setSelectedTags(initialTags);
      debouncedFormUpdate(initialTags);
    }
  }, [tag]);

  const debouncedFormUpdate = useCallback(
    (tags: string[]) => {
      if (formUpdateTimeoutRef.current) {
        clearTimeout(formUpdateTimeoutRef.current);
      }

      formUpdateTimeoutRef.current = setTimeout(() => {
        updateFormData("tags", tags);
        onTagsChange?.(tags);
      }, 100);
    },
    [updateFormData, onTagsChange]
  );

  useEffect(() => {
    if (selectedTags.length > 0 || onTagsChange) {
      debouncedFormUpdate(selectedTags);
    }

    return () => {
      if (formUpdateTimeoutRef.current) {
        clearTimeout(formUpdateTimeoutRef.current);
      }
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, [selectedTags, debouncedFormUpdate]);

  const handleAddTag = useCallback(() => {
    const trimmedValue = tagInputValue.trim();

    if (!trimmedValue) return;

    if (selectedTags.includes(trimmedValue)) {
      setTagInputValue("");
      setSearchTerm("");
      return;
    }

    const existingTag = categories.find(
      (tag) => tag.name.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (existingTag) {
      setSelectedTags((prev) => [...prev, existingTag.name]);
    } else {
      const newTag: Tag = {
        name: trimmedValue,
        count: 1,
        id: trimmedValue.toLowerCase(),
      };

      setCategories([...categories, newTag]);
      setSelectedTags((prev) => [...prev, trimmedValue]);
    }

    setTagInputValue("");
    setSearchTerm("");
  }, [tagInputValue, selectedTags, categories, setCategories]);

  const toggleTag = useCallback(
    (tagName: string) => {
      setSelectedTags((prev) => {
        const isSelected = prev.includes(tagName);
        const newTags = isSelected
          ? prev.filter((t) => t !== tagName)
          : [...prev, tagName];

        // Update form data with the new tags
        debouncedFormUpdate(newTags);

        return newTags;
      });
    },
    [debouncedFormUpdate]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );
  const filteredTags = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((tag) =>
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const tagButtons = useMemo(
    () =>
      filteredTags.map((category) => (
        <TagButton
          key={category.id}
          tag={category.name}
          isSelected={selectedTags.includes(category.name)}
          onClick={() => toggleTag(category.name)}
        />
      )),
    [filteredTags, selectedTags, toggleTag]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setTagInputValue(value);
      setSearchTerm(value);
    },
    []
  );

  return (
    <div className='space-y-2'>
      <div className='flex gap-3 items-center overflow-hidden h-5'>
        {!allowedText && (
          <label htmlFor='tags-input' className='text-sm text-text font-medium'>
            Tags
          </label>
        )}
      </div>

      <div className='flex rounded mb-6'>
        <input
          type='text'
          value={tagInputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          name='tags'
          id='tags-input'
          className='input w-full rounded-md px-3 py-2 text-sm'
          placeholder='Search or add new tag'
          aria-label='Add or search tags'
        />
        <button
          type='button'
          className='btn ml-2 h-[40px] inline-flex items-center rounded-md bg-hover px-3 py-2 text-sm font-medium hover:bg-card'
          onClick={handleAddTag}
          aria-label='Add tag'
        >
          <PlusIcon className='h-5 w-5  ' />
          Add
        </button>
      </div>

      <div className='flex flex-wrap gap-2 py-1  pt-4 justify-center'>
        {tagButtons}
      </div>
    </div>
  );
}
