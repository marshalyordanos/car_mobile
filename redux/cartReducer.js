import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Async thunk for initializing the cart from AsyncStorage
export const initializeCart = createAsyncThunk("cart/initialize", async () => {
  const storedCart = await AsyncStorage.getItem("cart");
  console.log("======storedCart=======", storedCart);
  return storedCart
    ? JSON.parse(storedCart)
    : { items: [], totalQuantity: 0, totalAmount: 0 };
});

// Helper function to save cart to AsyncStorage
const saveCartToStorage = async (cart) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to storage:", error);
  }
};

// Helper function to get cart from AsyncStorage
const getCartFromStorage = async () => {
  try {
    const storedCart = await AsyncStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : null;
  } catch (error) {
    console.error("Failed to get cart from storage:", error);
    return null;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  },
  reducers: {
    cartLocalstorage: (state, action) => {
      console.log("local", action.payload);
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity * 1;
      state.totalAmount = action.payload.totalAmount * 1;
    },
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.id === newItem.id &&
          JSON.stringify(item.selectedVariants) === JSON.stringify(newItem.selectedVariants)
      );

      if (existingItemIndex !== -1) {
        const existingItem = state.items[existingItemIndex];
        const newQuantity = existingItem.quantity + newItem.quantity;
        if (newQuantity <= existingItem.availableStock) {
          existingItem.quantity = newQuantity;
          state.totalQuantity += newItem.quantity;
          state.totalAmount += newItem.price * newItem.quantity;
        }
      } else {
        if (newItem.quantity <= newItem.availableStock) {
          state.items.push(newItem);
          state.totalQuantity += newItem.quantity;
          state.totalAmount += newItem.price * newItem.quantity;
        }
      }


      console.log(
        "{{{{{{{{{}}}}}}}}}}}}}}}}}}}}}}}}}}}|||||||||||||||||||||||||||||"
      );
      console.log("data1122", state.totalQuantity, state.totalAmount);
      const t = state.totalQuantity + "";
      const ta = state.totalAmount + "";
      const func = async () => {
        await AsyncStorage.setItem("items", JSON.stringify(state.items));
        await AsyncStorage.setItem("totalQuantity", t);
        await AsyncStorage.setItem("totalAmount", ta);
      };
      func();

      
    },
    removeFromCart: (state, action) => {
      const { id, selectedVariants } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === id &&
          JSON.stringify(item.selectedVariants) ===
            JSON.stringify(selectedVariants)
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.price * existingItem.quantity;
        state.items = state.items.filter(
          (item) =>
            !(
              item.id === id &&
              JSON.stringify(item.selectedVariants) ===
                JSON.stringify(selectedVariants)
            )
        );
      }
      const t = state.totalQuantity + "";
      const ta = state.totalAmount + "";
      const func = async () => {
        await AsyncStorage.setItem("items", JSON.stringify(state.items));
        await AsyncStorage.setItem("totalQuantity", t);
        await AsyncStorage.setItem("totalAmount", ta);
      };
      func();
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
    updateCartItemQuantity: (state, action) => {
      const { id, selectedVariants, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) =>
          item.id === id &&
          JSON.stringify(item.selectedVariants) ===
            JSON.stringify(selectedVariants)
      );

      if (existingItem && quantity <= existingItem.availableStock) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += quantityDifference;
        state.totalAmount += existingItem.price * quantityDifference;
      }
      const t = state.totalQuantity + ""; //
      const ta = state.totalAmount + "";
      const func = async () => {
        await AsyncStorage.setItem("items", JSON.stringify(state.items));
        await AsyncStorage.setItem("totalQuantity", t);
        await AsyncStorage.setItem("totalAmount", ta);
      };
      func();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeCart.fulfilled, (state, action) => {
      const loadedCart = action.payload;
      state.items = loadedCart.items;
      state.totalQuantity = loadedCart.totalQuantity;
      state.totalAmount = loadedCart.totalAmount;
    });
  },
});

export const {
  cartLocalstorage,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

// Middleware to save cart to AsyncStorage after each state change
const cartMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  if (
    cartSlice.actions.addToCart.match(action) ||
    cartSlice.actions.removeFromCart.match(action) ||
    cartSlice.actions.clearCart.match(action) ||
    cartSlice.actions.updateCartItemQuantity.match(action)
  ) {
    saveCartToStorage(store.getState().cart);

    // Log the updated cart from storage after add/remove operations
    getCartFromStorage().then((updatedCart) => {
      if (cartSlice.actions.addToCart.match(action)) {
        console.log("Cart after adding item (from storage):", updatedCart);
      } else if (cartSlice.actions.removeFromCart.match(action)) {
        console.log("Cart after removing item (from storage):", updatedCart);
      }
    });
  }
  return result;
};

export { cartMiddleware };
