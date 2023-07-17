import { Hotel, Room, Booking, TicketStatus, Enrollment, Ticket } from "@prisma/client";
import { notFoundError, paymentRequired } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";

async function getHotels(userId: number): Promise<Hotel[]>{
    const hotels: Hotel[] = await hotelsRepository.findHotels();
    if(!hotels || hotels.length === 0) throw notFoundError();

    const enrollment = await enrollmentRepository.getUserEnrollmentByUserId(userId);
    if(!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if(!ticket) throw notFoundError();

    if(
        ticket.status === TicketStatus.RESERVED || 
        ticket.TicketType.isRemote === true || 
        ticket.TicketType.includesHotel === false){
            throw paymentRequired();
        }

    return hotels;
}

const hotelService = {
    getHotels
}

export default hotelService;