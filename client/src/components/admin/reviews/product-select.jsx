import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const ProductSelect = ({ products, onProductChange, selected }) => {
  const handleValueChange = (value) => {
    onProductChange(value); 
  };
  return (
    <div className='w-full'>
       <Select className="outline-none" onValueChange={handleValueChange} value={selected}> 
      <SelectTrigger className="w-full outline-none">
        <SelectValue placeholder="Select a product" />
      </SelectTrigger>
      <SelectContent>
          {products.map((product) => (
            <SelectItem key={product._id} value={product._id} >
             <div className="flex items-center justify-center gap-3">
             <div className="w-14 h-14 overflow-hidden flex items-center justify-center">
              <img src={product.images[0]} alt={product.title} className='w-full ' />
             </div>
             {product.title}
             </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
    </div>
  );
};

export default ProductSelect;