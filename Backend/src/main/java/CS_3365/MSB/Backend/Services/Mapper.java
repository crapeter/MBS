package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;

public class Mapper {
  // Maps Model to DTO
  public static MovieDto mapToDto(Movie movie) {
    MovieDto movieDto = new MovieDto();
    movieDto.setTitle(movie.getTitle());
    movieDto.setDescription(movie.getDescription());
    movieDto.setGenre(movie.getGenre());
    movieDto.setRuntime(movie.getRuntime());
    movieDto.setReleaseDate(movie.getReleaseDate());
    movieDto.setDirector(movie.getDirector());
    movieDto.setCast(movie.getCast());
    movieDto.setPrice(movie.getPrice());
    return movieDto;
  }
  public static ReviewDto mapToDto(Review review) {
    ReviewDto reviewDto = new ReviewDto();
    reviewDto.setReview(review.getReview());
    return reviewDto;
  }
  public static TheaterDto mapToDto(Theater theater) {
    TheaterDto theaterDto = new TheaterDto();
    theaterDto.setRoomNumber(theater.getRoomNumber());
    theaterDto.setSeatsBooked(theater.getSeatsBooked());
    return theaterDto;
  }
  public static TicketDto mapToDto(Ticket ticket) {
    TicketDto ticketDto = new TicketDto();
    ticketDto.setMovie(mapToDto(ticket.getMovie()));
    ticketDto.setTheater(mapToDto(ticket.getTheater()));
    ticketDto.setNumberPurchased(ticket.getNumberPurchased());
    return ticketDto;
  }
  public static UserDto mapToDto(User user) {
    UserDto userDto = new UserDto();
    userDto.setAddress(user.getAddress());
    userDto.setName(user.getName());
    userDto.setEmail(user.getEmail());
    userDto.setPhoneNumber(user.getPhoneNumber());
    return userDto;
  }
}
