import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CartService } from '@/services/cart.service';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const data = await CartService.getLoggedUserCart();
    return data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addProductToCart = createAsyncThunk(
  'cart/addProductToCart',
  async (productId: string, thunkAPI) => {
    try {
      const data = await CartService.addToCart(productId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, count }: { productId: string; count: number }, thunkAPI) => {
    try {
      const data = await CartService.updateCartQuantity(productId, count);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (productId: string, thunkAPI) => {
    try {
      const data = await CartService.removeFromCart(productId);
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

interface CartState {
  cart: any | null;
  cartId: string | null;
  totalCartPrice: number;
  numOfCartItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  cartId: null,
  totalCartPrice: 0,
  numOfCartItems: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        
        // حماية ضد الـ null أو البيانات الفارغة
        if (!action.payload) {
          state.cart = null;
          state.numOfCartItems = 0;
          state.cartId = null;
          state.totalCartPrice = 0;
          return;
        }

        state.cart = action.payload;
        state.numOfCartItems = action.payload.numOfCartItems || 0;
        state.cartId = action.payload.cartId || action.payload.data?._id || null;
        state.totalCartPrice = action.payload.data?.totalCartPrice || action.payload.totalCartPrice || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addProductToCart.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.cart = action.payload;
        state.numOfCartItems = action.payload.numOfCartItems || 0;
        state.cartId = action.payload.cartId || action.payload.data?._id || null;
        state.totalCartPrice = action.payload.data?.totalCartPrice || action.payload.totalCartPrice || 0;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.cart = action.payload;
        state.numOfCartItems = action.payload.numOfCartItems || 0;
        state.cartId = action.payload.cartId || action.payload.data?._id || null;
        state.totalCartPrice = action.payload.data?.totalCartPrice || action.payload.totalCartPrice || 0;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.cart = action.payload;
        state.numOfCartItems = action.payload.numOfCartItems || 0;
        state.cartId = action.payload.cartId || action.payload.data?._id || null;
        state.totalCartPrice = action.payload.data?.totalCartPrice || action.payload.totalCartPrice || 0;
      });
  },
});

export default cartSlice.reducer;