
import pymysql 
pymysql.install_as_MySQLdb()
try:
	pass
except Exception:
	try:
		import pymysql
		pymysql.install_as_MySQLdb()
	except Exception:
		# neither mysqlclient nor pymysql is available; let imports fail later
		pass