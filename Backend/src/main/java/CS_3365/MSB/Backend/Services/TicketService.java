package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.TicketDto;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TicketService {
  @Autowired
  private TicketRepo ticketRepo;

  @Autowired
  private TheaterRepo theaterRepo;

  @Autowired
  private MovieRepo movieRepo;

  public ResponseEntity<String> getTotalNumberOfTickets() {
    List<Ticket> tickets = ticketRepo.findAll();

    if (tickets.isEmpty())
      return ResponseEntity.badRequest().body("No tickets found");

    int totalNumberSold = tickets.stream().mapToInt(Ticket::getNumberPurchased).sum();
    return ResponseEntity.ok().body("Total number of tickets sold: " + totalNumberSold);
  }

  public List<Integer> numberSold() {
    List<Ticket> tickets = ticketRepo.findAll();
    return tickets.stream().map(Ticket::getNumberPurchased).toList();
  }

  public ResponseEntity<Integer> getUniqueTickets(String location) {
    List<Ticket> tickets = ticketRepo.findAll();
    int ticketsSold = tickets.stream()
        .filter(ticket -> ticket.getTheater().getLocation().equalsIgnoreCase(location))
        .mapToInt(Ticket::getNumberPurchased)
        .sum();
    return ResponseEntity.ok().body(ticketsSold);
  }

  public List<TicketDto> getTicketsByLocation(String location) {
    List<Ticket> tickets = ticketRepo.findAll().stream()
        .filter(ticket -> ticket.getTheater().getLocation().equalsIgnoreCase(location))
        .toList();
    return Mapper.mapToTiList(tickets);
  }

  public ResponseEntity<Integer> getNumberSold() {
    List<Ticket> tickets = ticketRepo.findAll();
    int ticketsSold = tickets.stream().mapToInt(Ticket::getNumberPurchased).sum();
    return ResponseEntity.ok().body(ticketsSold);
  }

  public ResponseEntity<Integer> getNumberSoldByLocation(String location) {
    List<Ticket> tickets = ticketRepo.findAll();
    int ticketsSold = tickets.stream()
        .filter(ticket -> ticket.getTheater().getLocation().equalsIgnoreCase(location))
        .mapToInt(Ticket::getNumberPurchased)
        .sum();
    return ResponseEntity.ok().body(ticketsSold);
  }

  public List<TicketDto> getTheaterBreakdown(String location) {
    List<Ticket> tickets = ticketRepo.findAll();
    List<Ticket> ticketsByLocation = tickets.stream()
        .filter(ticket -> ticket.getTheater().getLocation().equalsIgnoreCase(location))
        .toList();

    if (ticketsByLocation.isEmpty())
      return List.of();
    return Mapper.mapToTiList(ticketsByLocation);
  }
}
