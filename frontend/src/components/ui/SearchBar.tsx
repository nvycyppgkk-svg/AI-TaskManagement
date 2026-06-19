import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useKanbanStore } from '../../store/kanbanStore';
import { useEffect } from 'react';

export default function SearchBar() {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 200);
  const setSearchQuery = useKanbanStore(s => s.setSearchQuery);

  useEffect(() => {
    setSearchQuery(debounced);
  }, [debounced, setSearchQuery]);

  return (
    <input
      type="text"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="カードを検索..."
      className="bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-white/50 focus:bg-white/20 transition"
    />
  );
}
