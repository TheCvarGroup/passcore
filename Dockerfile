FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Install Node.js for frontend build
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

WORKDIR /src
COPY . .

# Build the frontend first
WORKDIR /src/src/Unosquare.PassCore.Web/ClientApp
RUN npm ci
RUN npm run build

# Build the .NET application
WORKDIR /src
RUN dotnet restore
RUN dotnet publish src/Unosquare.PassCore.Web/Unosquare.PassCore.Web.csproj -c Release -o /app

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 80
ENTRYPOINT ["dotnet", "Unosquare.PassCore.Web.dll"]
