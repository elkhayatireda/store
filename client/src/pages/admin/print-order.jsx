import { axiosClient } from '@/api/axios';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PrintOrder = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosClient.get('/orders/' + id);
                setOrder(response.data);
            } catch (error) {
                console.error("There was an error fetching the products!", error);
            }
        };

        fetchData();
    }, [id]);

    const handlePrint = () => {
        const printArea = document.getElementById('orderDetails');
        html2canvas(printArea).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`<img src="${imgData}" style="width:100%" />`);
            printWindow.document.close();

            // Add this line to wait for the content to load before printing
            printWindow.onload = () => {
                printWindow.print();
            };
        });
    };

    if (!order) {
        return <div>Chargement...</div>;
    }

    return (
        <div className='mb-20 overflow-auto'>
            <div id="orderDetails" style={styles.orderContainer}>
                <h2 style={styles.title}>Détails de la commande</h2>
                <p><strong>Référence:</strong> #0{order.ref}</p>

                <h3 style={styles.subtitle}>Informations du client:</h3>
                <p><span style={styles.text}>Nom complet:</span> {order.guestInfo.fullName}</p>
                <p><span style={styles.text}>Téléphone:</span> {order.guestInfo.phone}</p>
                <p><span style={styles.text}>Adresse:</span> {order.guestInfo.address}</p>

                <h3 style={styles.subtitle}>Articles:</h3>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Titre</th>
                            <th style={styles.th}>Variante</th>
                            <th style={styles.th}>Quantité</th>
                            <th style={styles.th}>Prix Unitaire</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item, index) => (
                            <tr key={index} style={styles.tr}>
                                <td style={styles.td}>{item.title}</td>
                                <td style={styles.td}>{item.variant}</td>
                                <td style={styles.td}>{item.quantity}</td>
                                <td style={styles.td}>{item.unitPrice.toFixed(2)}DH</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <p><span style={styles.text}>Prix Total:</span> {order.totalPrice.toFixed(2)}DH</p>
            </div>

            <div className="w-full fixed bottom-0 border bg-white border-gray-200 right-0 left-0 flex items-center justify-end p-3">
                <Button
                    className='flex items-center gap-1'
                    onClick={handlePrint}
                >
                    <Printer /> Imprimer
                </Button>
            </div>
        </div>
    );
};

const styles = {
    orderContainer: {
        border: '1px solid #eee',
        padding: '20px',
        width: '700px',
        margin: '0 auto',
        backgroundColor: 'white',
    },
    title: {
        textAlign: 'center',
        color: 'blue',
    },
    subtitle: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    text: {
        color: 'gray',
        fontWeight: '400'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    th: {
        borderBottom: '1px solid #ddd',
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#f2f2f2',
    },
    tr: {
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '10px',
        textAlign: 'left',
    },
};

export default PrintOrder;