package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.*;
import CS_3365.MSB.Backend.Models.*;

import java.util.List;
import java.util.stream.Collectors;

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

  public static Movie mapToMovie(MovieDto movieDto) {
    Movie movie = new Movie();
    movie.setTitle(movieDto.getTitle());
    movie.setDescription(movieDto.getDescription());
    movie.setGenre(movieDto.getGenre());
    movie.setRuntime(movieDto.getRuntime());
    movie.setReleaseDate(movieDto.getReleaseDate());
    movie.setDirector(movieDto.getDirector());
    movie.setCast(movieDto.getCast());
    movie.setPrice(movieDto.getPrice());
    movie.setTheaters(null);
    movie.setReviews(null);
    return movie;
  }
}