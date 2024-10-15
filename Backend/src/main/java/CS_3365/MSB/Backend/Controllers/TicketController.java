package CS_3365.MSB.Backend.Controllers;

import CS_3365.MSB.Backend.Services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tickets")
public class TicketController {
  @Autowired
  private TicketService ticketService;

  @GetMapping("/all")
  public ResponseEntity<String> getTotalNumberOfTickets() {
    return ticketService.getTotalNumberOfTickets();
  }
}
