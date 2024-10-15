package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketService {
  @Autowired
  private TicketRepo ticketRepo;

  public ResponseEntity<String> getTotalNumberOfTickets() {
    List<Ticket> tickets = ticketRepo.findAll();

    if (tickets.isEmpty())
      return ResponseEntity.badRequest().body("No tickets found");

    int totalNumberSold = tickets.stream().mapToInt(Ticket::getNumberPurchased).sum();
    return ResponseEntity.ok().body("Total number of tickets: " + totalNumberSold);
  }

  public List<Integer> numberSold() {
    List<Ticket> tickets = ticketRepo.findAll();
    return tickets.stream().map(Ticket::getNumberPurchased).toList();
  }
}
