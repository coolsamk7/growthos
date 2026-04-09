# mark

# Building K6

1. Install latest version of go.
2. Run `go install go.k6.io/xk6@latest`
3. Run ` xk6 build --with github.com/grafana/xk6-sql@latest --with github.com/grafana/xk6-sql-driver-mysql@latest --with github.com/grafana/xk6-faker@latest`
4. It will generate k6 binary.

