
/**
 * filter special chars and replace spaces with '_'
 */
export const filterSearchTerm = (
    searchTerm: string | undefined,
    operator: 'space' | 'or' = 'space'
  ): string | undefined => {
    // 'cat_dog' matches 'cat dog'
    const joinBy = operator === 'space' ? '_' : ' | ';
  
    return (
      searchTerm &&
      searchTerm
        .trim()
        .replace(/[^a-z0-9\s]+/gi, '') // remove special chars
        .split(/\s+/)
        .join(joinBy)
    );
  };