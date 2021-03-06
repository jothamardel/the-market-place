import ConstantActionTypes from './register-business.constants';

export const registerBusinessAsync = (
  businessowner, businessname,
  phoneno, email, category,
  latitude, longitude, registered = false, rcNumber,
  city, state, address, tag, agent
) => (dispatch) => {
  dispatch({ type: ConstantActionTypes.REGISTER_BUSINESS_START });
  fetch(`${process.env.REACT_APP_API}/business`, {
      method: "post",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        owner: businessowner,
        businessname, phoneno, email, category, latitude, longitude,
        registered, rcNumber, city, state, address, tag, agent
      })
    })
    .then(response => {
      if (response.status === 200) {
        dispatch({
          type: ConstantActionTypes.REGISTER_BUSINESS_SUCCESS,
          payload: response.status
        });
        return response.json();
      } else {
        dispatch({
          type: ConstantActionTypes.REGISTER_BUSINESS_FAILED,
          payload: response.status
        });
        return response.json();
      }
    })
    .then(data => {
      if (!data || data === "Unable to resgister business.") {
        dispatch({
          type: ConstantActionTypes.REGISTER_BUSINESS_FAILED,
          payload: data
        });
        return;
      };
      dispatch({
        type: ConstantActionTypes.REGISTER_BUSINESS_SUCCESS,
        payload: data
      })
    })
    .catch(error => {
      dispatch({
        type: ConstantActionTypes.REGISTER_BUSINESS_FAILED,
        payload: error.message
      })
    })
};