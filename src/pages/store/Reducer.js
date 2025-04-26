const initialState = {
    user_data: {},  // Thêm phần user_data để lưu thông tin người dùng
    show_modal: false,
    toast_message: "",
    product_id: 0,
    cart_count: 0,
    wishlist_count: 0,
    toast_count: 0,
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_DATA":
            return {
                ...state,
                user_data: action.value,  // Lưu thông tin người dùng vào state
            };
        case "MODAL_CONTROL":
            return {
                ...state,
                show_modal: action.value,
            };
        case "LOGIN_CONTROL":
            return {
                ...state,
                show_modal: action.value,
            };
        case "QUICKVIEW_CONTROL":
            return {
                ...state,
                product_id: action.value,
                show_modal: true,
            };
        case "CART_COUNT":
            return {
                ...state,
                cart_count: action.value,
            };
        case "WISHLIST_COUNT":
            return {
                ...state,
                wishlist_count: action.value,
            };
        case "SHOW_TOAST":
            return {
                ...state,
                toast_message: action.value,
                toast_count: true,
            };
        case "HIDE_TOAST":
            return {
                ...state,
                toast_state: false,
            };
        // Nếu có thêm phần "USER" để xử lý thông tin người dùng, bạn có thể thêm vào đây
        case "USER":
            return {
                ...state,
                user_data: action.value,  // Lưu thông tin người dùng vào state
            };
            case "REMOVE_USER":
  return {
    ...state,
    user_data: null,
  };
  case 'LOGIN_SUCCESS':
    return {
        ...state,
        user_data: action.payload.user,
    };

case 'LOGOUT':
    return {
        ...state,
        user_data: null,
    };


        default:
            return state;

    }
};

export default Reducer;
