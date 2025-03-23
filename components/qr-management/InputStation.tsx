import React from 'react';

interface InputStationProps {
  stationName: string;
  onChange: (value: string) => void;
}

const InputStation: React.FC<InputStationProps> = ({ stationName, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-5 h-5 bg-[#CF0000] text-white rounded-full text-xs">1</div>
          <label htmlFor="station-name" className="text-sm font-medium text-gray-700">
            Masukan Nama Stasiun*
          </label>
        </div>
        <input
          id="station-name"
          type="text"
          value={stationName}
          onChange={handleChange}
          placeholder="Masukan Nama Stasiun"
          className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-100"
        />
      </div>
    </div>
  );
};

export default InputStation;