using Moq;
using Dokremstroi.Services.Managers;
using System.Linq.Expressions;
using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;

namespace Dokremstroi.Tests
{
    [TestFixture] // ����� � �������
    public class UserManagerTests
    {
        private Mock<IRepository<User>> _userRepositoryMock;
        private IUserManager _userManager;

        [SetUp] // ����������� ����� ������ ������
        public void Setup()
        {
            _userRepositoryMock = new Mock<IRepository<User>>();
            _userManager = new UserManager(_userRepositoryMock.Object);
        }

        [Test]
        public async Task GetByUsernameAsync_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var expectedUser = new User { Id = 1, Username = "testuser" };
            _userRepositoryMock
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync(expectedUser);

            // Act
            var result = await _userManager.GetByUsernameAsync("testuser");

            // Assert
            Assert.IsNotNull(result, "������������ ������ ���� ������.");
            Assert.AreEqual(expectedUser.Id, result.Id, "ID ������������ ������ ���������.");
            Assert.AreEqual(expectedUser.Username, result.Username, "��� ������������ ������ ���������.");
        }

        [Test]
        public async Task GetByUsernameAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            _userRepositoryMock
                .Setup(repo => repo.FindAsync(It.IsAny<Expression<Func<User, bool>>>()))
                .ReturnsAsync((User)null);

            // Act
            var result = await _userManager.GetByUsernameAsync("nonexistentuser");

            // Assert
            Assert.IsNull(result, "������ ��������� null, ���� ������������ ���.");
        }

        [Test]
        public async Task GetAllAsync_ShouldReturnAllUsers()
        {
            // Arrange
            var users = new List<User>
            {
                new User { Id = 1, Username = "user1" },
                new User { Id = 2, Username = "user2" }
            };
            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(users);

            // Act
            var result = await _userManager.GetAllAsync();

            // Assert
            Assert.IsNotNull(result, "������ ������������� �� ������ ���� null.");
            Assert.AreEqual(2, result.Count(), "������ ���� ���������� 2 ������������.");
        }

        [Test]
        public async Task AddAsync_ShouldCallRepositoryAdd()
        {
            // Arrange
            var newUser = new User { Id = 3, Username = "newuser" };

            // Act
            await _userManager.AddAsync(newUser);

            // Assert
            _userRepositoryMock.Verify(repo => repo.AddAsync(newUser), Times.Once, "����� AddAsync ������ ���� ������ 1 ���.");
        }

        [Test]
        public async Task UpdateAsync_ShouldCallRepositoryUpdate()
        {
            // Arrange
            var user = new User { Id = 1, Username = "updateduser" };

            // Act
            await _userManager.UpdateAsync(user);

            // Assert
            _userRepositoryMock.Verify(repo => repo.UpdateAsync(user), Times.Once, "����� UpdateAsync ������ ���� ������ 1 ���.");
        }

        [Test]
        public async Task DeleteAsync_ShouldCallRepositoryDelete()
        {
            // Arrange
            int userId = 1;

            // Act
            await _userManager.DeleteAsync(userId);

            // Assert
            _userRepositoryMock.Verify(repo => repo.DeleteAsync(userId), Times.Once, "����� DeleteAsync ������ ���� ������ 1 ���.");
        }
    }
}
