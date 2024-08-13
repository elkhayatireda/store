import React, { useState, useEffect } from 'react';
import { Trash2, User } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { axiosClient } from "../../api/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Contacts() {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContacts, setSelectedContacts] = useState([]);
    const [searchColumn, setSearchColumn] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // fetch all contacts
    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axiosClient.get('/contact');
            setContacts(response.data);
            setFilteredContacts(response.data);
        } catch (error) {
            toast.error('Error fetching contacts');
        }
    };

    const filterContactsFunction = () => {
        let filtered = contacts.slice();
        filtered = filtered.filter(contact => {
            if (searchColumn === 'firstName') {
                return contact.firstName.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (searchColumn === 'lastName') {
                return contact.lastName.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (searchColumn === 'phone') {
                return contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
            }
            return true;
        });
        setFilteredContacts(filtered);
    }

    const resetFilters = () => {
        setSearchColumn('default');
        setSearchQuery("");
        setFilteredContacts(contacts);
    }

    useEffect(() => {
        filterContactsFunction();
    }, [searchColumn, searchQuery]);

    const handleSearchColumnChange = (e) => {
        setSearchColumn(e.target.value);
        setSelectedContacts([]);
    };

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
        setSelectedContacts([]);
    };

    const handleCheckboxChange = (contactId) => {
        setSelectedContacts(prevSelectedContacts => {
            if (prevSelectedContacts.includes(contactId)) {
                return prevSelectedContacts.filter(id => id !== contactId);
            } else {
                return [...prevSelectedContacts, contactId];
            }
        });
    };

    const checkAll = () => {
        if (selectedContacts.length === filteredContacts.length) {
            setSelectedContacts([]);
        } else {
            const allContactIds = filteredContacts.map(contact => contact._id);
            setSelectedContacts(allContactIds);
        }
    };

    const [contactDelete, setContactDelete] = useState(null);
    const [open, setOpen] = useState(false);
    const deleteContactHandle = async (contactIds) => {
        try {
            await axiosClient.delete(`/contact`, {
                data: { contactIds }
            });
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        }
    };
    const handleDelete = async (contacts) => {
        const isDeleted = await deleteContactHandle(contacts);
        if (isDeleted) {
            toast.success("Contact(s) deleted successfully");
            fetchContacts();
        } else {
            toast.error('Error deleting contact(s)');
        }
    };

    return (
        <div className="flex flex-col pt-16 pl-24 p-3 pr-5">
            <ToastContainer />
            <div className="flex w-full items-center justify-between pt-5">
                <h4 className='text-4xl font-semibold text-[#141414]'>Contacts</h4>
            </div>
            <div className="pt-16 flex items-end pr-3 mb-3 justify-start">
                <div className='flex items-center justify-between w-full'>
                    <div className='flex'>
                        <div className='w-62 mr-2'>
                            <select
                                id="searchColumn"
                                className="border-2 border-gray-300 py-3 text-gray-900 text-sm rounded-lg outline-none block w-full p-2.5"
                                value={searchColumn}
                                onChange={handleSearchColumnChange}
                            >
                                <option value="default" className='py-2 px-5'>Filter By</option>
                                <option value="firstName">First Name</option>
                                <option value="lastName">Last Name</option>
                                <option value="phone">Phone</option>
                            </select>
                        </div>
                        <div className='w-62 mr-2'>
                            <input
                                type="text"
                                className='w-full py-2 rounded outline-none border-2 border-gray-300 text-md pl-5 bg-white'
                                placeholder="Search"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                disabled={searchColumn === "default"}
                            />
                        </div>
                    </div>
                    {selectedContacts.length !== 0 &&
                        <div className='flex items-center justify-start mb-1 ml-3 mt-2'>
                            <button className='cursor-pointer flex gap-3 items-center bg-red-50 rounded py-2 px-5 text-red-600 font-semibold' onClick={() => setOpen(true)}>
                                Delete
                                <Trash2 color='#ff2f2f' size={20} />
                            </button>
                            <Dialog open={open} onOpenChange={() => setOpen(false)}>
                                <DialogContent className="sm:max-w-md bg-white">
                                    <DialogHeader>
                                        <DialogTitle>Are You sure?</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete these contacts?
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter className="sm:justify-start">
                                        <DialogClose asChild>
                                            <div className='flex gap-4 w-full'>
                                                <button className="basis-1/2 border-black border-2 bg-white rounded py-2">
                                                    Close
                                                </button>
                                                <button onClick={() => handleDelete(selectedContacts)} className="basis-1/2 text-white bg-black rounded py-2 px-5 w-full">
                                                    Confirm
                                                    {loading &&
                                                        <div className="inline-block h-5 w-5 ml-3 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                            role="status"></div>
                                                    }
                                                </button>
                                            </div>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    }
                </div>
            </div>
            <div className="overflow-x-auto sm:rounded-lg">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="">
                                <tr>
                                    <th className="p-4">
                                        <div className="flex items-center">
                                            <input
                                                id="checkbox-all"
                                                type="checkbox"
                                                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                                                checked={selectedContacts.length === filteredContacts.length && selectedContacts.length >= 1}
                                                onChange={checkAll}
                                            />
                                            <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                        </div>
                                    </th>
                                    <th className="py-3 text-sm font-small text-gray-700 text-start pl-5">
                                        <p className='mr-2'>First Name</p>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small text-left text-gray-700">
                                        <p className='mr-2'>Last Name</p>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small text-left text-gray-700">
                                        <div className='flex items-center'>
                                            <p className='mr-2'>Phone</p>
                                        </div>
                                    </th>
                                    <th className="py-3 px-6 text-sm font-small text-left text-gray-700">
                                        <div className='flex items-center'>
                                            <p className='mr-2'>date</p>
                                        </div>
                                    </th>
                                    <th className="p-4">
                                        <div className='flex items-center'>
                                            <p>Action</p>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 dark:divide-gray-700">
                                {filteredContacts.map(contact => (
                                    <tr className="hover:bg-[#f7f6f6]" key={contact._id}>
                                        <td className="p-3 w-4">
                                            <div className="flex items-center">
                                                <input
                                                    id={`checkbox-${contact._id}`}
                                                    type="checkbox"
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300"
                                                    checked={selectedContacts.includes(contact._id)}
                                                    onChange={() => handleCheckboxChange(contact._id)}
                                                />
                                                <label htmlFor={`checkbox-${contact._id}`} className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <td className="py-3 text-start pl-5 font-semibold text-gray-900">
                                            <div className="flex items-center">
                                                <Avatar>
                                                    <AvatarImage src={contact.avatar || "/default-avatar.png"} alt={`${contact.firstName} ${contact.lastName}`} />
                                                    <AvatarFallback><User /></AvatarFallback>
                                                </Avatar>
                                                <span className='ml-3'>{contact.firstName}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-6 font-medium text-gray-900">
                                            {contact.lastName}
                                        </td>
                                        <td className="py-3 px-6 font-medium text-gray-900">
                                            {contact.phone}
                                        </td>
                                        <td className="py-3 px-6 font-medium text-gray-900">
                                            {contact.createdAt}
                                        </td>
                                        <td className="p-4 flex items-center justify-start">
                                            <button onClick={() => handleDelete([contact._id])} className="cursor-pointer flex items-center bg-red-50 rounded py-2 px-5 text-red-600 font-semibold">
                                                Delete
                                                <Trash2 color='#ff2f2f' size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
