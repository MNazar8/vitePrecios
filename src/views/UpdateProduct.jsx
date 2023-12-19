import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts, updateProduct } from '../redux/actions';
import { useNavigate } from 'react-router-dom'

const UpdateProduct = () => {
    const dispatch = useDispatch();
    const allProducts = useSelector((state) => state.products);
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmation, setConfirmation] = useState(false);

    const getFilteredProducts = (search, allProducts) => {
        if (!search) {
            return []
        }
        return allProducts.filter((product) =>
            product.product_name.toLowerCase().includes(search) ||
            product.supplier_code.toLowerCase().includes(search)
        )
    };

    const filteredProducts = getFilteredProducts(search, allProducts);


    useEffect(() => {
        dispatch(getAllProducts());
    }, []);

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setConfirmation(true);
    };

    const handleCancelUpdate = () => {
        setConfirmation(false);
        setSelectedProduct(null);
    };

    const handleConfirmedUpdate = async () => {
        try {
            // Aquí asumo que `updateProduct` es una acción de Redux que realiza la actualización en el servidor
            await dispatch(updateProduct(selectedProduct));

            // Después de confirmar, redirige al formulario de actualización
            navigate(`/update-form/${selectedProduct.id}`);

            // Cierra la ventana emergente y restablece el estado de confirmación
            setConfirmation(false);
        } catch (error) {
            console.error('Error al actualizar el producto', error);
            // Manejar el error, mostrar un mensaje al usuario, etc.
        }
    };

    return (
        <div className=' bg-black h-screen'>
            { !confirmation?
            <div>
                <div className=" pt-8">
                    <p className=' text-5xl'>Busque el producto que desea actualizar.</p>
                    <input type="text" className=' text-black w-4/5 text-center italic rounded-sm mt-3' placeholder='Ingrese un código, nombre de producto o proveedor para su busqueda.' onChange={(event) => setSearch(event.target.value)} />
                </div>
                {search && (
                    <div>
                        <table className=" text-left mt-8 w-full">
                            <thead className="">
                                <tr>
                                    <th colSpan="1">Nombre</th>
                                    <th colSpan="1">Codigo</th>
                                    <th colSpan="1">Precio de compra</th>
                                    <th colSpan="1">Precio de venta</th>
                                    <th colSpan="1">Margen de venta</th>
                                    <th colSpan="1">Venta por</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {filteredProducts.map((product) => (
                                    <tr className=" text-sm  border-b-2 hover:bg-green-800" key={product.id} onClick={() => { handleRowClick(product) }}>
                                        <td className="font-bold ">{product.product_name}</td>
                                        <td className="">{product.supplier_code}</td>
                                        <td className="">{product.purchase_price}</td>
                                        <td className="">{product.sales_price}</td>
                                        <td className="">{product.percent}%</td>
                                        <td className="">{product.messure_unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-md">
                            <p className="text-xl mb-4 text-black">¿Realmente desea actualizar este producto?</p>
                            <button className="bg-green-500 text-white py-2 px-4 rounded mr-2" onClick={handleConfirmedUpdate}>
                                Sí, actualizar
                            </button>
                            <button className="bg-red-500 text-white py-2 px-4 rounded" onClick={handleCancelUpdate}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}
            </div>:
            <div>LA CONCHA DE LARGO</div>
    }
        </div>
        )
    }

export default UpdateProduct