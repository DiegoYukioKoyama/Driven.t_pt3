import { Hotel, Room, Booking } from "@prisma/client";
import { prisma } from "@/config";

async function findHotels(): Promise<Hotel[]>{
    return prisma.hotel.findMany();
}

const hotelsRepository = {
    findHotels
};

export default hotelsRepository;