import { Response } from "express";
import httpStatus from "http-status";
import { AuthenticatedRequest } from "@/middlewares";
import hotelService from "@/services/hotels-service";


export async function getHotels(req: AuthenticatedRequest, res: Response){
    const { userId } = req;
    try {
        const hotels = await hotelService.getHotels(userId);
        return res.status(httpStatus.OK).send(hotels);
    } catch (e) {
        if(e.name === 'NotFoundError'){
            res.status(httpStatus.NOT_FOUND);
        }

        else if(e.name === 'PaymentRequired'){
            res.status(httpStatus.PAYMENT_REQUIRED);
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}