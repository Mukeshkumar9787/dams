"use client"
import { verifyOTP } from "@/http/apiCalls";
import { Button, Modal } from "antd";
import { useRouter } from "next/navigation";
import ResendButton from "../../Common/ResendButton";
import { afterSucessfullLogin } from "@/utils/helper";
import { VERIFY_OTP_TYPES } from "@/utils/constants";

const VerifyOTP = ({ type, sentTo=null, isOpen, onClose, resendOtp=null }) => {
  const router = useRouter();
  
  const handleSubmit = async(e) => {
      e.preventDefault();
      try {
        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        const response = await verifyOTP({...values, type});
        if(response.success){
          if(type === VERIFY_OTP_TYPES.RESET_PASSWORD){
            window.alert("Password Changed Successfully");
            router.push('/signin');
          }else{
            afterSucessfullLogin(response.data.token);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  return (
    <Modal centered open={isOpen} 
      onCancel={onClose} 
      okButtonProps={{style: {backgroundColor: 'blue', color: 'white'}}}
      footer={[
        <Button key="extra" onClick={onClose}>
          Change mail
        </Button>,
        <ResendButton key="cancel" onClick={resendOtp}/>,
        <Button key="ok" type="primary" className="bg-blue text-white" htmlType= 'submit' form='otpForm' >
          Verify
        </Button>
      ]}
      >
      <div>
          <form id="otpForm" onSubmit={handleSubmit}>
            <div className="mb-5">
              <label htmlFor="email" className="block mb-2.5">
                Email sent to <span className="font-bold">{sentTo}</span>
              </label>
              <input
                type={"email"}
                name="email"
                id="email"
                hidden
                readOnly
                value={sentTo}
                placeholder="Enter your email"
                className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="otp" className="block mb-2.5">
                OTP
              </label>
              
              <input
                type="number"
                name="otp"
                id="password"
                placeholder="Enter your OTP"
                autoComplete="on"
                minLength={6}
                maxLength={6}
                className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </form>
      </div>
    </Modal>
  );
};

export default VerifyOTP;
