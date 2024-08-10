using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Encodings.Web;
using System.Text.Unicode;
using takeout_tj.Data;
using takeout_tj.Utility;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

//ȫ��ע�� --����������Ŀ�����еķ�������Ч��
builder.Services.AddControllers(opt =>
{
    opt.Filters.Add<CustomExceptionFilterAttribute>();
    opt.Conventions.Insert(0, new RouteConvention(new RouteAttribute("api/")));
})
//���������������
.AddJsonOptions(options =>
{
    //ȡ��Unicode����
    options.JsonSerializerOptions.Encoder = JavaScriptEncoder.Create(UnicodeRanges.All);
    //��ʽ������ʱ���ʽ
    // options.JsonSerializerOptions.Converters.Add(new DatetimeJsonConverter("yyyy-MM-dd HH:mm:ss"));
    //���ݸ�ʽ����ĸСд
    // options.JsonSerializerOptions.PropertyNamingPolicy =JsonNamingPolicy.CamelCase;
    //���ݸ�ʽԭ�����
    options.JsonSerializerOptions.PropertyNamingPolicy = null;
    //���Կ�ֵ
    options.JsonSerializerOptions.IgnoreNullValues = true;
    //����������
    options.JsonSerializerOptions.AllowTrailingCommas = true;
    //�����л����������������Ƿ�ʹ�ò����ִ�Сд�ıȽ�
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = false;
})
// Microsoft.AspNetCore.Mvc.NewtonsoftJson;
// ���Json ת������,���磺ǰ̨��ʱ���̨ת������ʱ�м�ո���Ҫ��ΪT
// ��[JsonProperty("role_id")] ����Ҫ��[JsonPropertyName("id")] 
.AddNewtonsoftJson();

// Add services to the container.
// builder.Services.AddControllersWithViews();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework Core services for Oracle database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
	options.UseOracle(
		builder.Configuration.GetConnectionString("WaiMaiDBCon"),
		o => o.MigrationsAssembly("takeout_tj"));
});

// ��Program.csע�������Ĳ�ָ�����ݿ������ַ���
// builder.Services.AddDbContext<ModelContext>(option => option.UseOracle(builder.Configuration.GetConnectionString("WaiMaiDBCon")));

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "����ƽ̨����ϵͳ����",
        Description = "������swagger����"
    });
});
// ���Ի����򿪷�������, �κο�������ͨ��
builder.Services.AddCors(c =>
{
    c.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
    });
});

var app = builder.Build();

// �������
app.UseCors("AllowAllOrigins");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();


app.MapControllers();

app.Run();

