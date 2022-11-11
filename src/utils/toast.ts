// import {fetchStakes} from 'pages/Staking/staking.reducer';
import { openToast } from "../store/app/toast.reducer";
import { setTransaction } from "../store/refetch.reducer";
import store from "../store";
// import { fetchUserInfo } from "../store/app/user.reducer";
// import moment from 'moment';

type SendToast = {
  type: "success" | "error";
  msg: string;
};

export const sendToast = (args: SendToast) => {
  const { type, msg } = args;
  if (type === "success") {
    return store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: "Success",
          description: msg,
          status: "success",
          duration: 5000,
          isClosable: true,
        },
      })
    );
  }
  if (type === "error") {
    return store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: "Success",
          description: msg,
          status: "success",
          duration: 5000,
          isClosable: true,
        },
      })
    );
  }
};

export const toastWithReceipt = async (
  recepit: any,
  setTxPending: any,
  from?: string,
  actionType?: string
) => {
  // const nowTimeStamp = moment().unix();
  try {
    store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          title: "Success",
          description: `Tx successfully submitted!`,
          status: "success",
          duration: 5000,
          isClosable: true,
        },
      })
    );

    await recepit
      .wait()
      .then((receipt: any) => {
        if (receipt) {
          //   const { account, library } = store.getState().user.data;
          store.dispatch(setTxPending({ tx: false }));

          //@ts-ignore
          //   store.dispatch(fetchUserInfo({ account, library }));
          if (from === "Swapper") {
            return store.dispatch(
              setTransaction({
                transactionType: "Swapper",
                blockNumber: receipt.blockNumber,
              })
            );
          }
        }
      })
      .catch((e: any) => console.log(e));
  } catch (err) {
    store.dispatch(setTxPending({ tx: false }));
    console.log(err);
  }
};
