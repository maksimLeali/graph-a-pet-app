import React, {  useContext, useMemo, useState } from "react";

import { Modal, ModalProps } from "@components";



export type IModalContext = {
    open: boolean
    openModal: (props: ModalProps)=>void,
    closeModal: ()=>void,
} & Record<string, unknown>;



const defaultValue: IModalContext = {
    open: false,
    openModal: ()=>{},
    closeModal: ()=>{},
};

const ModalContext = React.createContext<IModalContext>(defaultValue);

type Props = {
    children: React.ReactNode;
};

export const ModalContextProvider: React.FC<
    Props & Record<string, unknown>
> = ({ children }) => {
    const [modal, setModal] = useState<ModalProps>();
    const [open,setOpen] = useState(false)
    // key incrementale: forza remount del contenuto ad ogni open → stato interno pulito
    const [modalKey, setModalKey] = useState(0)

    const openModal = (props :ModalProps)=> {
        setModalKey((k) => k + 1);
        setOpen(true);
        setModal(props)
    }
    const closeModal = ()=> {
      setOpen(false);
    }

    const value = useMemo(()=>( {...defaultValue, openModal, closeModal }), [])
    return (
        <ModalContext.Provider value={value}>
        { modal && <Modal key={modalKey} open={open} {...modal}/>}
        {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};
