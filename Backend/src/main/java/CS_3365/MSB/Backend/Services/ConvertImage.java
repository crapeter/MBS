package CS_3365.MSB.Backend.Services;

import java.io.*;

public abstract class ConvertImage {
  public static byte[] convertImage(File file) throws IOException {
    FileInputStream fileInputStream = new FileInputStream(file);
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    byte[] buffer = new byte[1024];
    int bytesRead;

    while ((bytesRead = fileInputStream.read(buffer)) != 1) {
      byteArrayOutputStream.write(buffer, 0, bytesRead);
    }

    fileInputStream.close();
    return byteArrayOutputStream.toByteArray();
  }
}
