
export const FEATURE_TYPES = {
    CATEGORY: 'CATEGORY',
    PRODUCT: 'PRODUCT'
};

export const STATUS_TYPES = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE'
};

export const ROLE_TYPES = {
    USER: 'USER',
    ADMIN: 'ADMIN'
}

export const ADDRESS_TYPES = {
    SHIP: 'SHIP',
    BILL: 'BILL'
}


export const STATUS_COLOR = {
    ACTIVE: "green",
    INACTIVE: "red"
}

export const ORDER_STATUS = {
    PAYMENT_PENDING: 'PAYMENT_PENDING',
    PLACED: 'PLACED',
    CONFIRMED: 'CONFIRMED',
    SHIPPED: 'SHIPPED',
    CANCELLED: 'CANCELLED',
    DELIVERED: 'DELIVERED'
}

export const ORDER_STATUS_COLOR = {
    PAYMENT_PENDING: {
        backgroundColor: '#FFF7E6',
        color: '#FA8C16'
    },
    PLACED: {
        backgroundColor: '#E6F4FF',
        color: '#1677FF'
    },
    CONFIRMED: {
        backgroundColor: '#E6FFFB',
        color: '#13C2C2'
    },
    SHIPPED: {
        backgroundColor: '#F0F5FF',
        color: '#2F54EB'
    },
    DELIVERED: {
        backgroundColor: '#F6FFED',
        color: '#52C41A'
    },
    CANCELLED: {
        backgroundColor: '#FFF1F0',
        color: '#FF4D4F'
    }
}


export const PROJECT_DETAILS = {
    name: "DAMS",
    description: "ecommerce platform"
}


export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+{}\[\]:;"'<>,./~`\\|-]).{8,}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_ALERT_MESSAGE = () => (<div>
  <p className="mb-2 font-semibold text-gray-900">
    Password must contain:
  </p>

  <ul className="space-y-1 text-sm">
    <li className="flex items-center gap-2 text-green-600">
      <span>✔</span>
      <span>Be at least 8 characters long</span>
    </li>
    <li className="flex items-center gap-2 text-green-600">
      <span>✔</span>
      <span>At least 1 uppercase letter (A–Z)</span>
    </li>
    <li className="flex items-center gap-2 text-green-600">
      <span>✔</span>
      <span>At least 1 number (0–9)</span>
    </li>
  </ul>
</div>)
export const CONFIRM_PASSWORD_ALERT_MESSAGE = () => <div className="text-center text-lg">Passwords do not match</div>;
export const LOGIN_TO_PROCEED_ALERT_MESSAGE = () => <div className="text-center text-lg">Login to Proceed...!</div>;

export const getAlertContent = (alert) => {
    if(alert === 'regex') return <PASSWORD_ALERT_MESSAGE/ >;
    if(alert === 'confirmPassword') return <CONFIRM_PASSWORD_ALERT_MESSAGE/>;
    if(alert === 'loginToProceed') return <LOGIN_TO_PROCEED_ALERT_MESSAGE/>;
    return <></>
  }


export const VERIFY_OTP_TYPES = {
    REGISTER: "REGISTER",
    LOGIN: "LOGIN",
    RESET_PASSWORD: "RESET_PASSWORD"
}