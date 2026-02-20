import React from 'react';
import { Link } from 'react-router-dom';

interface TagChipProps {
  name: string;
  slug: string;
  clickable?: boolean;
}

export const TagChip: React.FC<TagChipProps> = ({ name, slug, clickable = true }) => {
  const baseStyles = 'inline-block px-3 py-1 text-sm font-sf-pro bg-gray-100 text-secondary rounded-button transition-colors';
  
  if (clickable) {
    return (
      <Link
        to={`/tags/${slug}`}
        className={`${baseStyles} hover:bg-primary hover:text-white`}
      >
        {name}
      </Link>
    );
  }
  
  return <span className={baseStyles}>{name}</span>;
};
