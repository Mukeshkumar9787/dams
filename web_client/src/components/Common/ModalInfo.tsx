"use client"
import { Modal } from "antd";

const ModalInfo = ({ isOpen, onClose=null, content, onOk, closable=true }) => {
  return (
    <Modal centered width={720} cancelButtonProps={{className: closable ? '' : 'hidden'}} closable={closable} open={isOpen} onCancel={onClose} onOk={onOk} okButtonProps={{style: {backgroundColor: 'blue', color: 'white', borderRadius: 14, minWidth: 110}}} >
        <div className="m-2 sm:m-4">
          <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-4 sm:p-5">
            {content}
          </div>
        </div>
    </Modal>
  );
};

export default ModalInfo;
