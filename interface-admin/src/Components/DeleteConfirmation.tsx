
import { Modal } from 'antd';
import React from 'react';


const DeleteConfirmation = ({ showModal, handleModalClose, handleDelete }: any) => {


    return (
        <>
            <Modal  open={showModal} onCancel={handleModalClose} footer={null}>
                <div>
                    <p className=" mt-5 font-semibold mb-4">
                        Vous voulez vraiment supprimer définitivement cet élément ?
                    </p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={async()=>{handleDelete()}}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors"
                            > 
                                Supprimer
                            </button>
                            <button
                                onClick={handleModalClose}
                                className=" p-2 border-gray-500 bg-gray-100 text-gray-700  rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                                Annuler
                            </button>
                            
                        </div>
                    </div>
            </Modal>
        </>

    );
}

export default DeleteConfirmation;