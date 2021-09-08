# Cara Penggunaan

1. Install [Docker](https://docs.docker.com/get-docker/)
2. Pastikan Docker sudah terinstall

   ```console
    $ docker -v
    Docker version 19.03.1, build 74b1e89e8a
   ```

3. Clone Repository ini

   ```console
   git clone https://github.com/gymie/dicoding-backend-services.git namaproject
   ```

4. Jalankan docker-compose up -d

   ```console
   $ docker-compose up -d
   Creating network "namaproject_default" with the default driver
   Creating postgres ... done
   Creating redis    ... done
   Creating adminer  ... done
   ```

5. Untuk Menghentikan Container

   ```console
   docker-compose down
   ```

6. Untuk Menjalankan Container Tertentu cth hanya mau menjalankan container postgres saja

   ```console
   docker-compose up -d postgres
   ```

## Postgres

```env
USER : developer
PASSWORD : supersecretpassword
```

- Akses CLI Postgres

```console
docker exec -it postgres sh
```

- Buat database postgres

```console
/ # createdb -U developer notesapp
```

- Connect ke database

```console
/ # psql -U developer -d notesapp
```

- Link Command PSQL [Link](https://www.postgresqltutorial.com/psql-commands/)

## Adminer

Untuk Management Database Postgres

- Akses melalui browser

```console
localhost:8090
```

## RabbitMQ

Untuk Management Queue RabbitMQ

- Akses melalui browser

```console
localhost:5672
```

## RedisInsight

Untuk Management Redis menggunakan RedisInsight

- Akses melalui browser

```console
localhost:8001
```

- Masukkan Host: `localhost` atau local ip address device kalian.
- Cara mengetahui local ip address dengan command `ipconfig`
