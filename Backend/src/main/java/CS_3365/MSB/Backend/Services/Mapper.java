package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

public abstract class Mapper {
  // Maps Model to DTO
  public static MovieDto mapToDto(Movie movie) {
    MovieDto movieDto = new MovieDto();
    movieDto.setId(movie.getId());
    movieDto.setTitle(movie.getTitle());
    movieDto.setDescription(movie.getDescription());
    movieDto.setGenre(movie.getGenre());
    movieDto.setRunTime(movie.getRuntime());
    movieDto.setReleaseDate(movie.getReleaseDate());
    movieDto.setDirector(movie.getDirector());
    movieDto.setCast(movie.getCast());
    movieDto.setPrice(movie.getPrice());
    movieDto.setPlaying(movie.isPlaying());
    return movieDto;
  }

  public static ReviewDto mapToDto(Review review) {
    ReviewDto reviewDto = new ReviewDto();
    reviewDto.setMovieTitle(review.getMovie().getTitle());
    reviewDto.setName(review.getUser().getName());
    reviewDto.setReview(review.getReview());
    return reviewDto;
  }

  public static TheaterDto mapToDto(Theater theater) {
    TheaterDto theaterDto = new TheaterDto();
    theaterDto.setId(theater.getId());
    theaterDto.setLocation(theater.getLocation());
    theaterDto.setRoomNumber(theater.getRoomNumber());
    theaterDto.setSeatsBooked(theater.getSeatsBooked());
    theaterDto.setMovieIds(theater.getMovieId());
    return theaterDto;
  }

  public static TicketDto mapToDto(Ticket ticket) {
    TicketDto ticketDto = new TicketDto();
    ticketDto.setMovieId(ticket.getMovie().getId());
    ticketDto.setTheaterId(ticket.getTheater().getId());
    ticketDto.setMovieTitle(ticket.getMovie().getTitle());
    ticketDto.setNumberPurchased(ticket.getNumberPurchased());
    ticketDto.setRoomNumber(ticket.getRoomNumber());
    ticketDto.setLocation(ticket.getTheater().getLocation());
    ticketDto.setTime(ticket.getTime());
    return ticketDto;
  }

  public static UserDto mapToDto(User user) {
    UserDto userDto = new UserDto();
    userDto.setAddress(user.getAddress());
    userDto.setName(user.getName());
    userDto.setEmail(user.getEmail());
    userDto.setPhoneNumber(user.getPhoneNumber());
    userDto.setAdmin(user.isAdmin());
    return userDto;
  }

  // Maps Models to DTOs
  public static List<UserDto> mapToUList(List<User> users) {
    return users.stream().map(Mapper::mapToDto).collect(Collectors.toList());
  }

  public static List<MovieDto> mapToMList(List<Movie> movies) {
    return movies.stream().map(Mapper::mapToDto).collect(Collectors.toList());
  }

  public static List<ReviewDto> mapToRList(List<Review> reviews) {
    return reviews.stream().map(Mapper::mapToDto).collect(Collectors.toList());
  }

  public static List<TheaterDto> mapToThList(List<Theater> theaters) {
    return theaters.stream().map(Mapper::mapToDto).collect(Collectors.toList());
  }

  public static List<TicketDto> mapToTiList(List<Ticket> tickets) {
    return tickets.stream().map(Mapper::mapToDto).collect(Collectors.toList());
  }

  public static Theater mapToTheater(TheaterDto theaterDto) {
    Theater theater = new Theater();
    theater.setLocation(theaterDto.getLocation());
    theater.setRoomNumber(theaterDto.getRoomNumber());
    theater.setSeatsBooked(theaterDto.getSeatsBooked());
    theater.setMovieId(null);
    theater.setTickets(null);
    return theater;
  }

  public static List<String> mapToStringList(List<LocalTime> timesLoc) {
    return timesLoc.stream().map(LocalTime::toString).collect(Collectors.toList());
  }
}
