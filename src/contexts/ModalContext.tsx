import React, {  useContext, useEffect, useMemo, useState } from "react";
import { Modal, ModalProps } from "../components/Modal";



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

    const openModal = (props :ModalProps)=> {
        setOpen(true);
        setModal(props)
    }
    const closeModal = ()=> {
      setOpen(false);
    }

    const value = useMemo(()=>( {...defaultValue, openModal, closeModal }), [])
    return (
        <ModalContext.Provider value={value}> { modal && <Modal open={open} {...modal}/>} 
        {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};
