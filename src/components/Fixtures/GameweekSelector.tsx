interface TableLengthSelectorProps {
    minGw: number; 
    maxGw: number;
    setMinGw: (value: number) => void; // Function to update parent state
    setMaxGw: (value: number) => void; // Function to update parent state
  }
  
  export default function GameweekSelector ({ 
        minGw, 
        maxGw, 
        setMinGw, 
        setMaxGw
    }: TableLengthSelectorProps
) {

    const initialMinGw = 1
    const initialMaxGw = 38
  
    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
  
      setMinGw(value);
    };
  
    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
  
      setMaxGw(value);
    };
  
  
    return (
      <div className="flex items-center space-x-2 bg-teal-200 p-2 rounded-sm shadow-md">
        <label className="text-sm font-semibold text-black">From GW:</label>
        <input
          type="number"
          value={minGw}
          onChange={handleMinChange}
          min={initialMinGw}
          max={maxGw}
          className="w-14 px-0 py-1 rounded text-center text-black bg-[#bffcf7]"
        />
        <label className="text-sm font-semibold text-black">To GW:</label>
        <input
          type="number"
          value={maxGw}
          onChange={handleMaxChange}
          min={minGw}
          max={initialMaxGw}
          className="w-14 px-0 py-1 rounded text-center text-black bg-[#bffcf7]"
        />
      </div>
    );
  };