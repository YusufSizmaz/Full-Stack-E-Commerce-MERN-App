import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js";

export const getAddressesController = async (request, response) => {
  try {
    const userId = request.userId; // from auth middleware

    if (!userId) {
      return response.status(400).json({
        message: "Kullanıcı ID'si bulunamadı",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findById(userId).populate("address_details");

    if (!user) {
      return response.status(404).json({
        message: "Kullanıcı bulunamadı",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Adresler başarıyla getirildi",
      data: user.address_details || [],
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

export const addAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { address_line, city, state, pincode, country, mobile } = request.body;

    // Validation for required fields
    if (!city || city.trim() === "") {
      return response.status(400).json({
        message: "Şehir alanı zorunludur",
        error: true,
        success: false,
      });
    }

    if (!state || state.trim() === "") {
      return response.status(400).json({
        message: "İlçe alanı zorunludur",
        error: true,
        success: false,
      });
    }

    // Validation for mobile number
    let mobileNumber = null;
    if (mobile !== undefined && mobile !== null && mobile !== "") {
      const mobileStr = String(mobile).trim();
      if (mobileStr !== "") {
        // Remove spaces, dashes, and parentheses
        const cleanedMobile = mobileStr.replace(/[\s\-\(\)]/g, "");
        // Check if it contains only digits
        if (!/^\d+$/.test(cleanedMobile)) {
          return response.status(400).json({
            message: "Telefon numarası sadece rakamlardan oluşmalıdır",
            error: true,
            success: false,
          });
        }
        mobileNumber = parseInt(cleanedMobile, 10);
        if (isNaN(mobileNumber)) {
          return response.status(400).json({
            message: "Geçerli bir telefon numarası giriniz",
            error: true,
            success: false,
          });
        }
      }
    }

    const newAddress = new AddressModel({
      address_line: address_line || "",
      city: city.trim(),
      state: state.trim(),
      pincode: pincode || "",
      country: country || "",
      mobile: mobileNumber,
      status: true,
    });

    const savedAddress = await newAddress.save();

    // Add address to user's address_details array
    await UserModel.findByIdAndUpdate(userId, {
      $push: { address_details: savedAddress._id },
    });

    return response.json({
      message: "Adres başarıyla eklendi",
      data: savedAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return response.status(400).json({
        message: errorMessages.join(", "),
        error: true,
        success: false,
      });
    }

    // Handle Cast errors (e.g., invalid number format)
    if (error.name === "CastError") {
      const fieldName = error.path || "alan";
      return response.status(400).json({
        message: `${fieldName} için geçersiz değer. ${error.message}`,
        error: true,
        success: false,
      });
    }

    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

export const updateAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id, address_line, city, state, pincode, country, mobile } =
      request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Adres ID'si gereklidir",
        error: true,
        success: false,
      });
    }

    // Validate required fields if they are being updated
    if (city !== undefined && (!city || city.trim() === "")) {
      return response.status(400).json({
        message: "Şehir alanı boş olamaz",
        error: true,
        success: false,
      });
    }

    if (state !== undefined && (!state || state.trim() === "")) {
      return response.status(400).json({
        message: "İlçe alanı boş olamaz",
        error: true,
        success: false,
      });
    }

    // Validate mobile number if provided
    let mobileNumber = undefined;
    if (mobile !== undefined && mobile !== null && mobile !== "") {
      const mobileStr = String(mobile).trim();
      if (mobileStr !== "") {
        // Remove spaces, dashes, and parentheses
        const cleanedMobile = mobileStr.replace(/[\s\-\(\)]/g, "");
        // Check if it contains only digits
        if (!/^\d+$/.test(cleanedMobile)) {
          return response.status(400).json({
            message: "Telefon numarası sadece rakamlardan oluşmalıdır",
            error: true,
            success: false,
          });
        }
        mobileNumber = parseInt(cleanedMobile, 10);
        if (isNaN(mobileNumber)) {
          return response.status(400).json({
            message: "Geçerli bir telefon numarası giriniz",
            error: true,
            success: false,
          });
        }
      } else {
        mobileNumber = null;
      }
    }

    // Verify that the address belongs to the user
    const user = await UserModel.findById(userId);
    if (!user || !user.address_details.includes(_id)) {
      return response.status(403).json({
        message: "Bu adresi güncelleme yetkiniz bulunmamaktadır",
        error: true,
        success: false,
      });
    }

    // Build update object
    const updateData = {};
    if (address_line !== undefined) updateData.address_line = address_line;
    if (city !== undefined) updateData.city = city.trim();
    if (state !== undefined) updateData.state = state.trim();
    if (pincode !== undefined) updateData.pincode = pincode;
    if (country !== undefined) updateData.country = country;
    if (mobileNumber !== undefined) updateData.mobile = mobileNumber;

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAddress) {
      return response.status(404).json({
        message: "Adres bulunamadı",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Adres başarıyla güncellendi",
      data: updatedAddress,
      error: false,
      success: true,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map(
        (err) => err.message
      );
      return response.status(400).json({
        message: errorMessages.join(", "),
        error: true,
        success: false,
      });
    }

    // Handle Cast errors (e.g., invalid number format)
    if (error.name === "CastError") {
      const fieldName = error.path || "alan";
      let fieldNameTr = fieldName;
      if (fieldName === "mobile") fieldNameTr = "Telefon numarası";
      return response.status(400).json({
        message: `${fieldNameTr} için geçersiz değer. Lütfen doğru formatta giriniz.`,
        error: true,
        success: false,
      });
    }

    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

export const deleteAddressController = async (request, response) => {
  try {
    const userId = request.userId;
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Adres ID'si gereklidir",
        error: true,
        success: false,
      });
    }

    // Verify that the address belongs to the user
    const user = await UserModel.findById(userId);
    if (!user || !user.address_details.includes(_id)) {
      return response.status(403).json({
        message: "Bu adresi silme yetkiniz bulunmamaktadır",
        error: true,
        success: false,
      });
    }

    // Remove address from user's address_details array
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { address_details: _id },
    });

    // Delete the address
    const deletedAddress = await AddressModel.findByIdAndDelete(_id);

    if (!deletedAddress) {
      return response.status(404).json({
        message: "Adres bulunamadı",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Adres başarıyla silindi",
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Sunucu hatası oluştu",
      error: true,
      success: false,
    });
  }
};

