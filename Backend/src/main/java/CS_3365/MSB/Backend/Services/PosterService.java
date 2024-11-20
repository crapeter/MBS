package CS_3365.MSB.Backend.Services;

import CS_3365.MSB.Backend.DTO.PosterDTO;
import CS_3365.MSB.Backend.Models.*;
import CS_3365.MSB.Backend.Repos.PosterRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.List;

@Service
public class PosterService {
  @Autowired
  private PosterRepo posterRepo;

  public boolean uploadPoster(MultipartFile file, Long movieId, String title) {
    // Delete existing poster if it exists
    Poster exists = posterRepo.findByMovieId(movieId);
    if (exists != null) {
      posterRepo.delete(exists);
    }

    Poster poster = new Poster();
    try {
      poster.setTitle(title);
      poster.setMovieId(movieId);
      poster.setImage(file.getBytes());
      posterRepo.save(poster);
      return true;
    } catch (Exception ignored) {
    }
    return false;
  }

  public String getPoster(Long movieId) {
    Poster poster = posterRepo.findByMovieId(movieId);
    return poster == null ? null : Base64.getEncoder().encodeToString(poster.getImage());
  }

  public List<PosterDTO> getPosters() {
    return posterRepo.findAll().stream().map(poster -> {
      PosterDTO posterDTO = new PosterDTO();
      posterDTO.setImage(Base64.getEncoder().encodeToString(poster.getImage()));
      posterDTO.setMovieId(poster.getMovieId());
      return posterDTO;
    }).toList();
  }
}
