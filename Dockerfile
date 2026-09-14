# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["NeuroPivot/NeuroPivot.csproj", "NeuroPivot/"]
RUN dotnet restore "NeuroPivot/NeuroPivot.csproj"
COPY . .
WORKDIR "/src/NeuroPivot"
RUN dotnet publish "NeuroPivot.csproj" -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "NeuroPivot.dll"]
