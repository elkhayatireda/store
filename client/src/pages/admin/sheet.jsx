import React, { useState, useContext } from 'react';
import { axiosClient } from '../../api/axios'; // Assuming you're using axios for API requests
import { toast } from 'react-toastify';
import { authContext } from '../../contexts/AuthWrapper';

export default function Sheet() {
  const userContext = useContext(authContext);

  const [clientEmail, setClientEmail] = useState('');
  const [sheetId, setSheetId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([
    'Timestamp',
    'Order Reference',
    'Customer Name',
    'Customer Phone',
    'Customer Address',
    'Product Title',
    'Product Variant',
    'Quantity',
    'Unit Price',
    'Item Total Price',
    'Order Total Price',
    'Order Status',
  ]);

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelected) =>
      prevSelected.includes(column)
        ? prevSelected.filter((c) => c !== column)
        : [...prevSelected, column]
    );
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('/settings', {
        clientEmail,
        sheetId,
        privateKey,
        selectedColumns,
      });

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    }
  };

  return (
  
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
              Client Email
            </label>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Client Email"
              required
            />
          </div>
          <div>
            <label htmlFor="sheetId" className="block text-sm font-medium text-gray-700">
              Sheet ID
            </label>
            <input
              type="text"
              id="sheetId"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Sheet ID"
              required
            />
          </div>
          <div>
            <label htmlFor="privateKey" className="block text-sm font-medium text-gray-700">
              Private Key
            </label>
            <input
              type="password"
              id="privateKey"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Private Key"
              required
            />
          </div>
          <div>
            <h5 className="text-sm font-medium text-gray-700">Select Columns to Include:</h5>
            <div className="mt-2 space-y-2">
              {[
                'Timestamp',
                'Order Reference',
                'Customer Name',
                'Customer Phone',
                'Customer Address',
                'Product Title',
                'Product Variant',
                'Quantity',
                'Unit Price',
                'Item Total Price',
                'Order Total Price',
                'Order Status',
              ].map((column) => (
                <label key={column} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnChange(column)}
                    className="mr-2"
                  />
                  {column}
                </label>
              ))}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
  );
}
