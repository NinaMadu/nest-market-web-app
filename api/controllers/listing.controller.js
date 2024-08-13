import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);

    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, "Listing not found"));

    if(req.user.id !== listing.userRef) {
        return next(errorHandler(403, "You cannot delete this"))
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json("Listing has been deleted!");
    } catch (error) {
        next(error);
    }

}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) return next(errorHandler(404, "Listing is not found"));

    if(req.user.id !== listing.userRef) {
        return next(errorHandler(403, "You cannot update this listing"))
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true
            }
        )
        res.status(200).json(updatedListing);

    } catch (error) {
        next(error)
    }
}

export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) return next(errorHandler(404, "Listing not found!"));
  
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  }

  export const getListings = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;

        // Handle negligible query
        let negligible;
        if (req.query.negligible === 'true') {
            negligible = true;
        } else if (req.query.negligible === 'false') {
            negligible = false;
        } else {
            negligible = { $in: [false, true] };
        }

        // Handle type query
        let type;
        if (req.query.type === 'used') {
            type = 'used';
        } else if (req.query.type === 'brandnew') {
            type = 'brandnew';
        } else {
            type = { $in: ['used', 'brandnew'] };
        }

        // Handle category query
        let category;
        if (req.query.category && req.query.category !== 'All' && req.query.category !== undefined) {
            category = req.query.category;
        } else if(req.query.category === undefined){
            category = { $in: ['Real Estate', 'Other', 'Sports Equipment', 'Furniture', 'Electronics', 'Automobile'] };
        }
        else {
            category = { $in: ['Real Estate', 'Other', 'Sports Equipment', 'Furniture', 'Electronics', 'Automobile'] };
        }

        const searchTerm = req.query.searchTerm || '';

        const sort = req.query.sort || 'createdAt';
        const order = req.query.order === 'asc' ? 1 : -1;

        const listings = await Listing.find({
            title: { $regex: searchTerm, $options: 'i' },
            type,
            negligible,
            category,
        })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

        return res.status(200).json(listings);
    } catch (error) {
        next(error);
    }
};