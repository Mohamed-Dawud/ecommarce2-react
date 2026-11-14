import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WishlistService } from '@/services/wishlist.service';

export const getWishlist = createAsyncThunk('wishlist/getWishlist', async (_, thunkAPI) => {
  try {
    const data = await WishlistService.getWishlist();
    return data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
  }
});

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string, thunkAPI) => {
    try {
      const data = await WishlistService.addToWishlist(productId);
      return data; // البيانات الراجعة
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string, thunkAPI) => {
    try {
      const data = await WishlistService.removeFromWishlist(productId);
      return { data, productId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

interface WishlistState {
  wishlistIds: string[]; // مصفوفة تحتوي على IDs المنتجات المفضلة فقط لسهولة التحقق من الأيقونة
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlistIds: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.fulfilled, (state, action) => {
        // استخراج الـ IDs فقط من المنتجات المفضلة لتفعيل حالة القلب بسهولة
        state.wishlistIds = action.payload.map((item: any) => item._id);
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        // تحديث الـ IDs بناءً على الـ response الجديد من السيرفر
        if (action.payload?.data) {
          state.wishlistIds = action.payload.data;
        }
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.wishlistIds = state.wishlistIds.filter((id) => id !== action.payload.productId);
      });
  },
});

export default wishlistSlice.reducer;