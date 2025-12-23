import { useContext } from 'react';
import { BookContext } from '../contexts/BookContext';

export const useBooks = () => {
  const context = useContext(BookContext);
  
  if (!context) {
    throw new Error('useBooks must be used within BookProvider');
  }
  
  return context;
};