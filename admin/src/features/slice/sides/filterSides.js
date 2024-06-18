import { createSlice } from "@reduxjs/toolkit";
import { createFilter, getFilter } from "../../actions/sides/filterSides";

const initialState = {
  isLoading: false,
  isSuccess: false,
  filterData: [],
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const filterSidesSlice = createSlice({
  name: "filterSidesSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createFilter.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(createFilter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = "";
        state.filterData = action.payload.data;
        console.log(state.filterData)
        // toast.success("Filter Added Successfully...");
      })
      .addCase(createFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
        // toast.error(action?.payload || "Something went wrong");
      })

      .addCase(getFilter.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(getFilter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.errorMessage = "";
        state.filterData = action.payload.data;
      })
      .addCase(getFilter.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = action.payload;
        // toast.error(action?.payload || "Something went wrong");
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = filterSidesSlice.actions;
export default filterSidesSlice.reducer;
