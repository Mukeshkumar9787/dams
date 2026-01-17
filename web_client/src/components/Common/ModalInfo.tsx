"use client"
import { Modal } from "antd";

const ModalInfo = ({ isOpen, onClose=null, content, onOk, closable=true }) => {
  return (
    <Modal centered cancelButtonProps={{className: closable ? '' : 'hidden'}} closable={closable} open={isOpen} onCancel={onClose} onOk={onOk} okButtonProps={{style: {backgroundColor: 'blue', color: 'white'}}} >
        <div className="m-4">
          <div className="rounded-lg bg-gray-50 p-4">
            {content}
          </div>
        </div>
    </Modal>
  );
};

export default ModalInfo;
