import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";

export async function getHotels(req: AuthenticatedRequest, res: Response){
    try {
        const hotels = await hotelService.getHotels();
        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
        return res.sendStatus(httpStatus.NOT_FOUND);
    }
}